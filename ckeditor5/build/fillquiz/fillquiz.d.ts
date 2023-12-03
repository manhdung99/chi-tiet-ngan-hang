export default class FillQuiz extends Plugin {
    static get requires(): (typeof FillQuizEditing | typeof FillQuizUI)[];
}
import { Plugin } from "@ckeditor/ckeditor5-core";
import FillQuizEditing from "./fillquizediting";
import FillQuizUI from "./fillquizui";
