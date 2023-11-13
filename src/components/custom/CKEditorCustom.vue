<template>
  <div class="border">
    <ckeditor
      :editor="editor"
      v-model="localEditorData"
      :config="editorConfig"
      @input="$emit('update:modelValue', localEditorData)"
    ></ckeditor>
  </div>
</template>

<script lang="ts">
import Editor from "../../../ckeditor5";
import { defineComponent, ref, onMounted } from "vue";
import { uploadImage } from "../../uses/function";
export default defineComponent({
  name: "CKEditorCustom",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const localEditorData = ref(""); // Use props.value, not props.editorData

    function uploader(editor: any) {
      editor.plugins.get("FileRepository").createUploadAdapter = (
        loader: any
      ) => {
        return uploadImage(loader);
      };
    }
    const editor = Editor;
    const editorConfig = {
      extraPlugins: [uploader],
      mediaEmbed: {
        previewsInData: true,
      },
    };
    onMounted(() => {
      localEditorData.value = props.modelValue;
    });
    return {
      localEditorData,
      editor,
      editorConfig,
    };
  },
});
</script>
