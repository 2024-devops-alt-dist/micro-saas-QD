import '../assets/css/Button.css';

export function CustomButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={'btn ' + (props.className || '')} {...props}>
      {props.children}
    </button>
  );
}
