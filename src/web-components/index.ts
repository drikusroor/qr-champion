import r2wc from "@r2wc/react-to-web-component"
import MCGQRCodes from '../App'

const WebMCGQRCodes = r2wc(MCGQRCodes)

customElements.define("web-mcg-qr-codes", WebMCGQRCodes)