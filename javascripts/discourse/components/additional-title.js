import Component from "@ember/component";
import { inject as service } from "@ember/service";
import User from "discourse/models/user";

export default {
    setupComponent() {
      this.reopen({
        router: service(),
        currentUser: User.current(),
        additionalTitle: false
      });
    }
}
