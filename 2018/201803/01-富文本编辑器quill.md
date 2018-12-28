# 富文本编辑器 quill

## 快速开始

```
<!-- Include Quill stylesheet -->
<link href="https://cdn.quilljs.com/1.0.0/quill.snow.css" rel="stylesheet">

<!-- Create the toolbar container -->
<div id="toolbar">
  <button class="ql-bold">Bold</button>
  <button class="ql-italic">Italic</button>
</div>

<!-- Create the editor container -->
<div id="editor">
  <p>Hello World!</p>
</div>

<!-- Include the Quill library -->
<script src="https://cdn.quilljs.com/1.0.0/quill.js"></script>

<!-- Initialize Quill editor -->
<script>
  var editor = new Quill('#editor', {
    modules: { toolbar: '#toolbar' },
    theme: 'snow'
  });
</script>
```

## 使用 npm 安装

```
npm install quill
```

```
import Quill from "quill";
import "quill/dist/quill.snow.css";
// 如果使用bubble主题，则引入quill.bubble.css
// import "quill/dist/quill.bubble.css";
```

## 功能配置及使用

```
// quill富文本插件配置信息
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  // [{ 'direction': 'rtl' }],                         // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  // [{ 'font': [] }],
  [{ align: [] }],
  // ['link', 'image', 'video'],
  ["link", "image"]
  // ['clean']                                         // remove formatting button
];
const quillOptions = {
  debug: "warn",
  modules: {
    toolbar: toolbarOptions
  },
  placeholder: "请输入文本...",
  readOnly: false,
  theme: "snow"
};

this.editor = new Quill(this.textarea, quillOptions);   // this.textarea是实例化quill对应的dom
this.editor.on("text-change", this.handleQuillChange);  // 输入内容改变时调用
this.editor.clipboard.dangerouslyPasteHTML(value);      // 设置默认值

// 需要自定义功能，如上传图片
// quill自带的上传图片会将图片转成base64格式，可以自定义实现上传使用返回的url
let toolbar = this.editor.getModule("toolbar");
toolbar.addHandler("image", () => {
    document.getElementsByClassName("quill-upload")[0].click();
});

// 上传图片成功后，将图片插入内容中
let index = this.editor.getLength();
this.editor.insertEmbed(index, "image", `//ektfiles.icsoc.net/${url}`);
```
