import ffmpegPath from "ffmpeg-static"
import ffmpeg, { setFfmpegPath } from "fluent-ffmpeg"

setFfmpegPath(ffmpegPath!)

export { ffmpeg }
