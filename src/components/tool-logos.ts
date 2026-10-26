// Tool logos for the home page tools band and the résumé: the tools' own
// marks in their own colours, as the inner markup of an <svg> (rendered with
// dangerouslySetInnerHTML, like the icons). The logos are trademarks of their
// owners and appear only to name the tools. `tint` is the colour the band
// washes the tile with.
export type ToolLogo = {
  name: string;
  viewBox: string;
  markup: string;
  tint: string;
  /** Set until the tool's name is known: it stays out of the résumé's list. */
  unnamed?: true;
};

export const toolLogos: ToolLogo[] = [
  {
    name: "Paper",
    viewBox: "0 0 39 39",
    tint: "#81adec",
    markup: `<path d="M39 24H24V6H6V24H24V39H0V6H6V0H39V24Z" fill="#81ADEC"/>`,
  },
  {
    name: "Figma",
    viewBox: "0 0 54 80",
    tint: "#a259ff",
    markup: `<path d="M13.3333 80.0002C20.6933 80.0002 26.6667 74.0268 26.6667 66.6668V53.3335H13.3333C5.97333 53.3335 0 59.3068 0 66.6668C0 74.0268 5.97333 80.0002 13.3333 80.0002Z" fill="#0ACF83"/><path d="M0 39.9998C0 32.6398 5.97333 26.6665 13.3333 26.6665H26.6667V53.3332H13.3333C5.97333 53.3332 0 47.3598 0 39.9998Z" fill="#A259FF"/><path d="M0 13.3333C0 5.97333 5.97333 0 13.3333 0H26.6667V26.6667H13.3333C5.97333 26.6667 0 20.6933 0 13.3333Z" fill="#F24E1E"/><path d="M26.6667 0H40.0001C47.3601 0 53.3334 5.97333 53.3334 13.3333C53.3334 20.6933 47.3601 26.6667 40.0001 26.6667H26.6667V0Z" fill="#FF7262"/><path d="M53.3334 39.9998C53.3334 47.3598 47.3601 53.3332 40.0001 53.3332C32.6401 53.3332 26.6667 47.3598 26.6667 39.9998C26.6667 32.6398 32.6401 26.6665 40.0001 26.6665C47.3601 26.6665 53.3334 32.6398 53.3334 39.9998Z" fill="#1ABCFE"/>`,
  },
  {
    name: "Storybook",
    viewBox: "0 0 256 319",
    tint: "#ff4785",
    markup: `<defs><path d="M9.872 293.324.012 30.574C-.315 21.895 6.338 14.54 15.005 14L238.494.032c8.822-.552 16.42 6.153 16.972 14.975.02.332.031.665.031.998v286.314c0 8.839-7.165 16.004-16.004 16.004-.24 0-.48-.005-.718-.016l-213.627-9.595c-8.32-.373-14.963-7.065-15.276-15.388Z" id="storybook__a"/></defs><mask id="storybook__b" fill="#fff"><use href="#storybook__a"/></mask><use fill="#FF4785" href="#storybook__a"/><path d="m188.665 39.127 1.527-36.716L220.884 0l1.322 37.863a2.387 2.387 0 0 1-3.864 1.96l-11.835-9.325-14.013 10.63a2.387 2.387 0 0 1-3.829-2.001Zm-39.251 80.853c0 6.227 41.942 3.243 47.572-1.131 0-42.402-22.752-64.684-64.415-64.684-41.662 0-65.005 22.628-65.005 56.57 0 59.117 79.78 60.249 79.78 92.494 0 9.052-4.433 14.426-14.184 14.426-12.705 0-17.729-6.49-17.138-28.552 0-4.786-48.458-6.278-49.936 0-3.762 53.466 29.548 68.887 67.665 68.887 36.935 0 65.892-19.687 65.892-55.326 0-63.36-80.961-61.663-80.961-93.06 0-12.728 9.455-14.425 15.07-14.425 5.909 0 16.546 1.042 15.66 24.801Z" fill="#FFF" mask="url(#storybook__b)"/>`,
  },
  {
    // TODO: name this tool (the author hasn't said which it is), then drop `unnamed`.
    name: "tool",
    unnamed: true,
    viewBox: "0 0 228 120",
    tint: "#ea4b71",
    markup: `<path fill-rule="evenodd" clip-rule="evenodd" d="M204 48C192.817 48 183.42 40.3514 180.756 30H153.248C147.382 30 142.376 34.241 141.412 40.0272L140.425 45.9456C139.489 51.5648 136.646 56.4554 132.626 60C136.646 63.5446 139.489 68.4352 140.425 74.0544L141.412 79.9728C142.376 85.759 147.382 90 153.248 90H156.756C159.42 79.6486 168.817 72 180 72C193.255 72 204 82.7452 204 96C204 109.255 193.255 120 180 120C168.817 120 159.42 112.351 156.756 102H153.248C141.516 102 131.504 93.5181 129.575 81.9456L128.588 76.0272C127.624 70.241 122.618 66 116.752 66H107.244C104.58 76.3514 95.183 84 84 84C72.817 84 63.4204 76.3514 60.7561 66H47.2439C44.5796 76.3514 35.183 84 24 84C10.7452 84 0 73.2548 0 60C0 46.7452 10.7452 36 24 36C35.183 36 44.5796 43.6486 47.2439 54H60.7561C63.4204 43.6486 72.817 36 84 36C95.183 36 104.58 43.6486 107.244 54H116.752C122.618 54 127.624 49.759 128.588 43.9728L129.575 38.0544C131.504 26.4819 141.516 18 153.248 18L180.756 18C183.42 7.64864 192.817 0 204 0C217.255 0 228 10.7452 228 24C228 37.2548 217.255 48 204 48ZM204 36C210.627 36 216 30.6274 216 24C216 17.3726 210.627 12 204 12C197.373 12 192 17.3726 192 24C192 30.6274 197.373 36 204 36ZM24 72C30.6274 72 36 66.6274 36 60C36 53.3726 30.6274 48 24 48C17.3726 48 12 53.3726 12 60C12 66.6274 17.3726 72 24 72ZM96 60C96 66.6274 90.6274 72 84 72C77.3726 72 72 66.6274 72 60C72 53.3726 77.3726 48 84 48C90.6274 48 96 53.3726 96 60ZM192 96C192 102.627 186.627 108 180 108C173.373 108 168 102.627 168 96C168 89.3726 173.373 84 180 84C186.627 84 192 89.3726 192 96Z" fill="#ea4b71"/>`,
  },
  {
    name: "ClickUp",
    viewBox: "0 0 64 64",
    tint: "#6647f0",
    markup: `<path fill-rule="evenodd" clip-rule="evenodd" d="M6.43828 50.2095C5.81176 49.4456 5.94882 48.3212 6.71918 47.7027L14.0169 41.8433C14.6535 41.3322 15.5841 41.4476 16.1032 42.0777C21.06 48.0956 26.32 50.8815 32.142 50.8815C37.9238 50.8815 43.0403 48.135 47.7801 42.1839C48.2888 41.5452 49.2172 41.4131 49.8629 41.9129L57.2604 47.6377C58.0415 48.2422 58.1989 49.3637 57.5855 50.1379C50.5775 58.9839 41.9971 63.6446 32.142 63.6446C22.3156 63.6446 13.6586 59.013 6.43828 50.2095Z" fill="url(#clickup__paint0_linear_8_569)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M32.4953 17.1804C32.2202 16.9368 31.8067 16.9367 31.5314 17.1801L15.663 31.2116C15.0564 31.748 14.1285 31.6857 13.599 31.0731L7.40986 23.9122C6.88774 23.3082 6.95019 22.3961 7.54979 21.8688L31.0527 1.20062C31.6021 0.717503 32.4248 0.717611 32.9741 1.20088L56.4822 21.8847C57.0822 22.4125 57.1439 23.3256 56.6205 23.9294L50.4164 31.0866C49.8862 31.6982 48.9589 31.7594 48.353 31.2229L32.4953 17.1804Z" fill="url(#clickup__paint1_linear_8_569)"/><defs><linearGradient id="clickup__paint0_linear_8_569" x1="5.3335" y1="32.1624" x2="58.6653" y2="32.1624" gradientUnits="userSpaceOnUse"><stop offset="0.225962" stop-color="#6647F0"/><stop offset="0.793269" stop-color="#0091FF"/></linearGradient><linearGradient id="clickup__paint1_linear_8_569" x1="5.3335" y1="31.6447" x2="58.6653" y2="31.6447" gradientUnits="userSpaceOnUse"><stop stop-color="#FF02F0"/><stop offset="0.778846" stop-color="#F76808"/></linearGradient></defs>`,
  },
  {
    name: "Jump",
    viewBox: "-7.28 -19.28 66.56 66.56",
    tint: "#fbae01",
    markup: `<path fill="url(#logo-jump-p6)" d="M10.74 7.16 4.54.8A2.66 2.66 0 0 0 0 2.66V7.5l10.74 11.18z"/><path fill="url(#logo-jump-p7)" d="M9.19 28h1.55v-9.32L0 7.5v10.73z"/><path fill="url(#logo-jump-p8)" d="M0 25.41A2.6 2.6 0 0 0 2.58 28H9.2L0 18.23z"/><path fill="url(#logo-jump-p3)" d="M10.74 2.66v4.5l11.22 11.52V7.63L15.3.8a2.66 2.66 0 0 0-4.56 1.86"/><path fill="url(#logo-jump-p4)" d="M10.74 28h8.96l-8.96-9.32z"/><path fill="url(#logo-jump-p5)" d="M10.74 7.16v11.52L19.7 28h2.26v-9.32z"/><path fill="url(#logo-jump-p0)" d="M21.96 2.67v4.96l11.3 11.6h.02V7.75L26.63.85a2.8 2.8 0 0 0-2-.85 2.67 2.67 0 0 0-2.67 2.67"/><path fill="url(#logo-jump-p1)" d="M21.96 7.63v11.05L31.03 28h2.25v-8.75z"/><path fill="url(#logo-jump-p2)" d="M21.96 28h9.07l-9.07-9.32z"/><path fill="#111" d="M51.66 25.22A1.9 1.9 0 0 0 50 23.33l-.34-.04c-1-.13-1.94-.6-2.65-1.33L33.28 7.75V28H49a2.66 2.66 0 0 0 2.67-2.67zM39.2 23.54h-.09a1.78 1.78 0 1 1 .1 0"/><defs><linearGradient id="logo-jump-p0" x1="21.96" x2="33.28" y1="9.62" y2="9.62" gradientUnits="userSpaceOnUse"><stop stop-color="#ffd849"/><stop offset=".96" stop-color="#fbae01"/></linearGradient><linearGradient id="logo-jump-p1" x1="21.96" x2="33.28" y1="17.81" y2="17.81" gradientUnits="userSpaceOnUse"><stop stop-color="#ffb700"/><stop offset="1" stop-color="#f9aa01"/></linearGradient><linearGradient id="logo-jump-p2" x1="21.96" x2="31.03" y1="23.34" y2="23.34" gradientUnits="userSpaceOnUse"><stop stop-color="#ff9500"/><stop offset="1" stop-color="#f8aa00"/></linearGradient><linearGradient id="logo-jump-p3" x1="10.74" x2="21.96" y1="9.34" y2="9.34" gradientUnits="userSpaceOnUse"><stop stop-color="#ff651e"/><stop offset="1" stop-color="#e4400a"/></linearGradient><linearGradient id="logo-jump-p4" x1="10.74" x2="19.7" y1="23.34" y2="23.34" gradientUnits="userSpaceOnUse"><stop stop-color="#c42c00"/><stop offset="1" stop-color="#d63600"/></linearGradient><linearGradient id="logo-jump-p5" x1="10.74" x2="21.96" y1="17.58" y2="17.58" gradientUnits="userSpaceOnUse"><stop stop-color="#ef3c00"/><stop offset="1" stop-color="#d63601"/></linearGradient><linearGradient id="logo-jump-p6" x1="0" x2="10.74" y1="9.34" y2="9.34" gradientUnits="userSpaceOnUse"><stop stop-color="#3f80ff"/><stop offset="1" stop-color="#084fe0"/></linearGradient><linearGradient id="logo-jump-p7" x1="0" x2="10.74" y1="17.75" y2="17.75" gradientUnits="userSpaceOnUse"><stop stop-color="#0255ff"/><stop offset="1" stop-color="#0145d2"/></linearGradient><linearGradient id="logo-jump-p8" x1="0" x2="9.19" y1="23.11" y2="23.11" gradientUnits="userSpaceOnUse"><stop stop-color="#0041c6"/><stop offset="1" stop-color="#0045d0"/></linearGradient></defs>`,
  },
];
