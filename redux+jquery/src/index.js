import "../../store";
import ChatInfo from "./components/chat/Info/index.js";

class App {
  constructor(props) {
    this.initContainer();
  }

  initContainer() {
    let chatInfo = new ChatInfo({ domId: "chat-info" });
  }
}

const app = new App();
