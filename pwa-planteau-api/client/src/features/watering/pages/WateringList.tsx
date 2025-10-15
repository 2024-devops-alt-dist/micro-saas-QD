
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wateringService } from '../services/wateringService';
import Header from '../components/Header';
import WeekCarousel from '../components/WeekCarousel';
import TodayTasks from '../components/TodayTasks';
import TomorrowReminders from '../components/TomorrowReminders';

type Watering = {
	id_watering: number;
	plantName: string;
	frequency: string;
	nextWatering: string;
};

const weekDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

function getWeekDates() {
	const today = new Date();
	const week = [];
	for (let i = -2; i <= 4; i++) {
		const d = new Date(today);
		d.setDate(today.getDate() + i);
		week.push({
			day: d.getDate(),
			weekDay: weekDays[d.getDay()],
			iso: d.toISOString().slice(0, 10),
			isToday: i === 0,
		});
	}
	return week;
}

export default function WateringList() {
	const [waterings, setWaterings] = useState<Watering[]>([]);
	const week = getWeekDates();
	const todayIso = new Date().toISOString().slice(0, 10);

	useEffect(() => {
		wateringService.getAll().then(setWaterings);
	}, []);

	// Sépare les tâches du jour et les rappels (tâches du lendemain)
	const todayTasks = waterings.filter(w => w.nextWatering === todayIso);
	const tomorrowIso = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
	const tomorrowTasks = waterings.filter(w => w.nextWatering === tomorrowIso);

	return (
		<div className="p-4 max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col relative">
			<Header name="Quentin" avatarSrc="/assets/images/avatar-homme.webp" />
			<WeekCarousel week={week} />
			<TodayTasks todayTasks={todayTasks} />
			<TomorrowReminders tomorrowTasks={tomorrowTasks} />
			<div className="flex justify-end mt-8">
				<Link
					to="/watering/create"
					className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl shadow-lg transition"
					aria-label="Planifier une tâche"
				>
					+
				</Link>
			</div>
		</div>
	);
}
