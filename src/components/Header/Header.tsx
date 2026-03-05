import { ConnectButton } from "../ConnectButton";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="max-w-[1500px] flex justify-between items-center p-5 mx-auto">
      <Logo />
      <ConnectButton />
    </header>
  );
};

export default Header;
