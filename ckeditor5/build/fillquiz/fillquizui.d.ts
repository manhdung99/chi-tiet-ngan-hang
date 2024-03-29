export default class FillQuizUI extends Plugin {
    static get requires(): (typeof ContextualBalloon)[];
    init(): void;
    _balloon: ContextualBalloon | undefined;
    formView: FormView | undefined;
    _createFormView(): FormView;
    _showUI(): void;
    _hideUI(): void;
    _enableBalloonActivators(): void;
    _getBalloonPositionData(): {
        target: () => Range;
    };
}
import { Plugin } from "@ckeditor/ckeditor5-core";
import { ContextualBalloon } from "@ckeditor/ckeditor5-ui";
import FormView from "./fillquizview";
