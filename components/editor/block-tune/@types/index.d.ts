import { API, BlockAPI, ToolConfig } from "@editorjs/editorjs"
import { BlockTuneData } from "@editorjs/editorjs/types/block-tunes/block-tune-data"

type BlockTuneConstructorOptions<Config extends object = any> = {
  api: API
  config?: ToolConfig<Config>
  block: BlockAPI
  data?: BlockTuneData
}
