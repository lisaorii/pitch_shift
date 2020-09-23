# pitch_shift

There are 3 buttons at the top of the interface:
Record - begin recording audio　録音開始
Pause - pause recording　録音一時停止
Stop - stop recording　録音終了

Stopボタンをクリックすることによって音声が保存され、スクリーンに再生可能な状態で現れます。
Once Stop is clicked, the audio will be saved and the sound clip will appear on the screen.

保存した音声をrecording.jsでURLに変換し、URLをTone.Player(url) (LINE 218) に使いたいのですが、URLへの変換がうまくいきません。

一旦音声をwavファイルとしてダウンロードしてでも構いません。
