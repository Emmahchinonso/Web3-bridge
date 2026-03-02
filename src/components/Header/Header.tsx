import { ConnectButton } from "../ConnectButton";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <Logo />
      <ConnectButton />
    </header>
  );
};

export default Header;
