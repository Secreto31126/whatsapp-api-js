# Media

## Image

```ts
const image_message = new Image("https://i.imgur.com/4QfKuz1.png");
const image_id_message = new Image("12345678", true);
const image_caption_message = new Image("https://i.imgur.com/4QfKuz1.png", false, "Hello world!");
```

## Video

```ts
const video_message = new Video("https://www.example.com/video.mp4");
const video_id_message = new Video("12345678", true);
const video_caption_message = new Video("https://www.example.com/video.mp4", false, "Hello world!");
```

## Audio

```ts
const audio_message = new Audio("https://www.example.com/audio.mp3");
const audio_id_message = new Audio("12345678", true);
```

## Document

```ts
const document_message = new Document("https://www.example.com/document.pdf");
const document_id_message = new Document("12345678", true);
const document_caption_message = new Document("https://www.example.com/document.pdf", false, "Hello world!");
const document_filename_message = new Document("https://www.example.com/document.pdf", false, undefined, "a weird filename.pdf");
```

## Sticker

```ts
const sticker_message = new Sticker("https://www.example.com/sticker.webp");
const sticker_id_message = new Sticker("12345678", true);
```

## Documentation

https://whatsappapijs.web.app/classes/messages.Media.html
https://whatsappapijs.web.app/classes/messages.Image.html
https://whatsappapijs.web.app/classes/messages.Video.html
https://whatsappapijs.web.app/classes/messages.Audio.html
https://whatsappapijs.web.app/classes/messages.Document.html
https://whatsappapijs.web.app/classes/messages.Sticker.html
