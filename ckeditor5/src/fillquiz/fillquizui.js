/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from "@ckeditor/ckeditor5-core";
import {
  ButtonView,
  ContextualBalloon,
  clickOutsideHandler,
} from "@ckeditor/ckeditor5-ui";
import FormView from "./fillquizview";
import "./css/style.css";

export default class AbbreviationUI extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    const editor = this.editor;

    // Create the balloon and the form view.
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add("abbreviation", () => {
      const button = new ButtonView();

      button.label = "Fillquiz";
      button.tooltip = true;
      button.withText = false;
      button.icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" x="0px" y="0px"><defs><style>
      .cls-1 {
        stroke-width: 0px;
      }
    </style></defs><path class="cls-1" d="m63.5450193,20.6757821c-.7809653-.7809653-2.0471601-.7809657-2.8281259-.0000009L12.4927113,68.8999023c-.0041504.0043945-.0072632.0092773-.0114136.0136719-.1098633.1113281-.2000732.2338867-.2784424.3618164-.0231934.0375977-.0411987.078125-.0618896.1176758-.0562134.1069336-.1021729.2167969-.1375122.3310547-.0080566.0253906-.0236816.0473633-.0307007.0737305l-5.7832031,21.5625c-.1855469.6904297.0117188,1.4277344.5175781,1.9326172.3798828.3798828.890625.5859375,1.4140625.5859375.1728516,0,.3466797-.0224609.5185547-.0683594l21.5625-5.7832031c.0262451-.0068359.0481567-.0224609.0739136-.0307617.1138916-.0351562.2237549-.0810547.3310547-.137207.0396118-.0209961.0797119-.0390625.1176758-.0620117.1279297-.0786133.2503662-.168457.3617554-.2788086.0042114-.0039062.0093384-.0068359.0134888-.0112305l48.2241812-48.2241202c.780966-.780965.7809664-2.0471604.0000009-2.8281259l-15.779296-15.779296ZM16.2659485,87.0246885l-3.2905113-3.2906062c-.2922827-.2922911-.4063902-.7183303-.2993253-1.1175801l1.7436201-6.5020343c.2306229-.8600025,1.3056756-1.1479459,1.9352752-.5183463l8.0489751,8.0489751c.6295979.6295979.341658,1.7046477-.5183412,1.9352739l-6.5020838,1.7436654c-.3992626.1070704-.8253163-.0070466-1.1176088-.2993475Z"/><path class="cls-1" d="m92.414159,19.1230469l-11.3988585-11.3989042c-.8213377-.821341-1.8714408-1.4179057-3.0239811-1.5622922-1.5735747-.1971323-3.0895942.3279655-4.1845823,1.4240871l-7.9248047,7.9248047c-.7809652.7809652-.7809652,2.0471598,0,2.828125l15.7792969,15.7792969c.390625.390625.9023438.5859375,1.4140625.5859375s1.0234375-.1953125,1.4140625-.5859375l7.7828327-7.7818373c.821474-.8213689,1.4194625-1.8707836,1.5653075-3.0232574.1992161-1.5742149-.3258225-3.0925096-1.4233355-4.1900226Z"/>`;
      // Show the UI on button click.
      this.listenTo(button, "execute", () => {
        this._showUI();
      });

      return button;
    });
  }

  _createFormView() {
    const editor = this.editor;
    const formView = new FormView(editor.locale);

    // Execute the command after clicking the "Save" button.
    this.listenTo(formView, "submit", () => {
      // Grab values from the abbreviation and title input fields.
      const userShow = formView.userShow.fieldView.element.value;
      const answerShow = formView.answerShow.fieldView.element.value;
      const descriptionShow = formView.descriptionShow.fieldView.element.value;
      const abbreviation = { userShow, descriptionShow, answerShow };
      editor.model.change((writer) => {
        editor.model.insertContent(writer.createText(" "));
        editor.model.insertContent(
          writer.createText(answerShow, { abbreviation: abbreviation })
        );
        editor.model.insertContent(writer.createText(" "));
      });

      // Hide the form view after submit.
      this._hideUI();
    });

    // Hide the form view after clicking the "Cancel" button.
    this.listenTo(formView, "cancel", () => {
      this._hideUI();
    });

    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler({
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI(),
    });

    return formView;
  }

  _showUI() {
    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData(),
    });

    this.formView.focus();
  }

  _hideUI() {
    // Clear the input field values and reset the form.
    this.formView.answerShow.fieldView.value = "";
    this.formView.descriptionShow.fieldView.value = "";
    this.formView.answerShow.fieldView.value = "";
    this.formView.element.reset();

    this._balloon.remove(this.formView);

    // Focus the editing view after inserting the abbreviation so the user can start typing the content
    // right away and keep the editor focused.
    this.editor.editing.view.focus();
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM
    target = () =>
      view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

    return {
      target,
    };
  }
}
