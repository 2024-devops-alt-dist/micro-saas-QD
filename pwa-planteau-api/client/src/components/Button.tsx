import { Button } from '@radix-ui/themes';
import '../assets/css/Button.css';

export function CustomButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button className="btn" {...props}>
      {props.children}
    </Button>
  );
}
