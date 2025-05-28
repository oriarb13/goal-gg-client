import { ModeToggle } from "./theme/mode-toggle";
import Language from "./theme/language";
const Nav = () => {
  return (
    <div className="flex items-center justify-between">
      <ModeToggle />
      <Language />
    </div>
  );
};

export default Nav;
