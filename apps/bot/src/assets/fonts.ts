import geistBold from "~/assets/fonts/geist-bold.otf" with { type: "file" }
import geistMedium from "~/assets/fonts/geist-medium.otf" with { type: "file" }
import geistRegular from "~/assets/fonts/geist-regular.otf" with { type: "file" }
import geistSemibold from "~/assets/fonts/geist-semibold.otf" with { type: "file" }
import { loadAsset } from "~/assets/load"

export const geistBoldFile = loadAsset(geistBold)
export const geistSemiboldFile = loadAsset(geistSemibold)
export const geistMediumFile = loadAsset(geistMedium)
export const geistRegularFile = loadAsset(geistRegular)
