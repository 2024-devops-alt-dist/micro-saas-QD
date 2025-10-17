
import '../assets/css/Button.css';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function CustomButton(props: CustomButtonProps) {
  return (
    <button className={"btn " + (props.className || "")} {...props}>
      {props.children}
    </button>
  );
}
