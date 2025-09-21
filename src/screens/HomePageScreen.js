import { flowRight } from "lodash";
import withHomepageScreen from "../components/hocs/withHomepageScreen";
import HomePageUI from "./HomePageUI";

const HomePageScreen = flowRight(withHomepageScreen)(HomePageUI);

export default HomePageScreen;
