import { flowRight } from "lodash";
import withCreatePostScreen from "../components/hocs/withCreatePostScreen";
import CreatePostUI from "./CreatePostUI";

const CreatePostScreen = flowRight(withCreatePostScreen)(CreatePostUI);

export default CreatePostScreen;
