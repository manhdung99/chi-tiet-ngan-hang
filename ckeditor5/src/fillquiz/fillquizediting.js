import { Plugin } from "@ckeditor/ckeditor5-core";
import FillQuizCommand from "./fillquizcommand";
export default class FillQuizEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();
    this.editor.commands.add("addFillquiz", new FillQuizCommand(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.extend("$text", {
      allowAttributes: ["abbreviation", "fillquiz"],
    });
    schema.register("fillquiz", {
      allowIn: ["$root", "$block"],
      allowContentOf: "$block",
      allowAttributes: ["contenteditable", "readonly", "title"],
    });
    schema.register("input", {
      allowIn: "fillquiz",
      isObject: true,
      allowAttributes: [
        "value",
        "ans",
        "placeholder",
        "dps",
        "contenteditable",
        "class",
        "size",
      ], // Allow the 'value' attribute
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;
    conversion.for("upcast").elementToElement({
      view: "fillquiz",
      model: (viewElement, { writer }) => {
        return writer.createElement("fillquiz", {
          title: viewElement.getAttribute("title"),
        });
      },
    });

    conversion.for("downcast").elementToElement({
      model: "fillquiz",
      view: (modelElement, { writer }) => {
        const titleValue = modelElement.getAttribute("title") || "";
        const fillquizView = writer.createContainerElement("fillquiz", {
          title: titleValue,
          contenteditable: "false",
          readonly: "1",
        });

        return fillquizView;
      },
    });

    conversion.for("upcast").elementToElement({
      view: "input",
      model: (viewElement, { writer }) => {
        return writer.createElement("input", {
          value: viewElement.getAttribute("value"),
          ans: viewElement.getAttribute("ans"),
          placeholder: viewElement.getAttribute("placeholder"),
          dps: viewElement.getAttribute("dps"),
          contenteditable: "false",
          readonly: "1",
          class: "fillquiz",
        });
      },
    });

    conversion.for("downcast").elementToElement({
      model: "input",
      view: (modelElement, { writer }) => {
        const inputValue = modelElement.getAttribute("value") || "";
        const ansValue = modelElement.getAttribute("ans") || "";
        const placeholderValue = modelElement.getAttribute("placeholder") || "";
        const dspValue = modelElement.getAttribute("dps") || "";
        const inputView = writer.createEmptyElement("input", {
          type: "text",
          value: inputValue,
          ans: ansValue,
          placeholder: placeholderValue,
          dps: dspValue,
          contenteditable: "false",
          readonly: "1",
          class: "fillquiz",
        });

        return inputView;
      },
    });
  }
}
