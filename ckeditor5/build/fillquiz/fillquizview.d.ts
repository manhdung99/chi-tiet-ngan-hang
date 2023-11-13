export default class FormView extends View<HTMLElement> {
    constructor(locale: any);
    userShow: LabeledFieldView<import("@ckeditor/ckeditor5-ui").InputTextView>;
    answerShow: LabeledFieldView<import("@ckeditor/ckeditor5-ui").InputTextView>;
    descriptionShow: LabeledFieldView<import("@ckeditor/ckeditor5-ui").InputTextView>;
    saveButtonView: ButtonView;
    cancelButtonView: ButtonView;
    childViews: import("@ckeditor/ckeditor5-ui").ViewCollection<LabeledFieldView<import("@ckeditor/ckeditor5-ui").InputTextView> | ButtonView>;
    focus(): void;
    _createInput(label: any): LabeledFieldView<import("@ckeditor/ckeditor5-ui").InputTextView>;
    _createButton(label: any, icon: any, className: any): ButtonView;
}
import { View } from "@ckeditor/ckeditor5-ui";
import { LabeledFieldView } from "@ckeditor/ckeditor5-ui";
import { ButtonView } from "@ckeditor/ckeditor5-ui";
