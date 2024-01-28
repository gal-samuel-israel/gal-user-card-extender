import { apiInitializer } from "discourse/lib/api";
import additionalTitle from "../components/additional-title";

export default apiInitializer("1.6", (api) => {
    const outlet1 = 'user-card-post-names';
    const outlet2 = 'user-post-names';
    api.renderInOutlet(outlet1, additionalTitle);
    api.renderInOutlet(outlet2, additionalTitle);
});