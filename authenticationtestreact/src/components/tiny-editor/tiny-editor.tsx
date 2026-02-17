import { Editor } from "@tinymce/tinymce-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./tiny-editor.css";

interface MergeFieldModel {
  title: string;
  value: string;
}

export interface TinyEditorHandle {
  insertContent: (content: string) => void;
}

interface TinyEditorProps{
  initialContent?: string;
  refreshToken?: string;
  height?: string;
  width?: string;
  mergeFields?: MergeFieldModel[];
  onChangeContent: (value: string) => void;
  onDirty?: () => void;
}

const editorPlugins = [
  "advlist",
  "autolink",
  "lists",
  "link",
  "image",
  "charmap",
  "preview",
  "anchor",
  "searchreplace",
  "visualblocks",
  "code",
  "fullscreen",
  "insertdatetime",
  "media",
  "table",
  "wordcount",
];

const TinyEditor = forwardRef<TinyEditorHandle, TinyEditorProps>(
  ({ initialContent = "", height = "50vh", width = "100%", mergeFields = [], onChangeContent, onDirty }, ref) => {
  const editorRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    insertContent: (content: string) => {
      editorRef.current?.insertContent(content);
    },
  }));
  const [editorKey, setEditorKey] = useState<string>(crypto.randomUUID());
  const [editorInit, setEditorInit] = useState<{}>({
    height: height,
    width: width,
    iframe_attrs: { style: "background-color: ghostwhite;" },
    highlight_on_focus: false,
    menubar: false,
    plugins: editorPlugins,
    setup: (editor: any) => {
      registerMergeTagOption(editor, mergeFields);
      registerImageOption(editor);
    },
    toolbar:
      `undo redo  bold italic ${mergeFields.length > 0 ? "mergefields" : ""} | blocks fontsize| forecolor backcolor |` +
      `photo link table|` +
      "alignleft aligncenter alignright alignjustify | " +
      // "align | " +
      "bullist numlist | outdent indent | removeformat |" +
      "fullscreen",
    statusbar: true,
    branding: false,
    elementpath: false,
    content_style: `
        .mce-content-body [contentEditable=false][data-mce-selected]{
            outline: 0;
        }
        .mce-content-body [contentEditable=false]{
            //background: #b8ffd9ff;
        }
        `,
  });

  function registerImageOption(editor: any) {
    editor.ui.registry.addButton("photo", {
      icon: "image",
      tooltip: "insert image",
      onAction: () => openEditorDialog(editor),
    });
  }

  function openEditorDialog(editor: any) {
    editor.windowManager.open({
      title: "Upload Image",
      body: {
        type: "panel",
        items: [
          {
            type: "htmlpanel",
            html: `<input type="file" id="imagebox" accept="image/*" />`,
          },
        ],
      },
      buttons: [
        { type: "submit", text: "Insert", primary: true, name: "insert" },
        { type: "cancel", text: "Close" },
      ],
      onSubmit: (window: any) => {
        const input = document.getElementById("imagebox") as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            editor.insertContent(
              `<img src="${reader.result}" alt="${file.name}" height="200px"/>`
            );
          };
          reader.readAsDataURL(file);
        }
        window.close();
      },
    });
  }

  function registerMergeTagOption(editor: any, mergeTags: MergeFieldModel[]) {
    editor.ui.registry.addMenuButton("mergefields", {
      text: "Merge Fields",
      fetch: (callback: any) => {
        const items = mergeTags.map((field: MergeFieldModel) => ({
          type: "menuitem",
          text: field.title,
          onAction: () => {
            editor.insertContent(`{{${field.value}}}`);
          },
        }));
        callback(items);
      },
    });
  }

  useEffect(() => {
    //if initial content changes, we re-setup whole Editor.
    if (editorRef.current) {
      //change in editor key forces the editor to refresh
      setEditorKey(crypto.randomUUID());
      setEditorInit((prev: any) => {
        return {
          ...prev,
          setup:  (editor: any) => {
            registerMergeTagOption(editor, mergeFields);
            registerImageOption(editor);
          },
        };
      });

      //optional
      setTimeout(() => {
        editorRef.current.setContent(initialContent);
      }, 300);
    }
  }, [initialContent]);


  return (
    <>
      <Editor
        key={editorKey}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={initialContent}
        init={editorInit}
        onDirty={onDirty}
        onEditorChange={(newValue: string) => {
          onChangeContent(newValue);
        }}
      />
    </>
  );
});

TinyEditor.displayName = "TinyEditor";

export default TinyEditor;
