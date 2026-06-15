const ROUNDED_BASE =
  "!rounded-[20px] !px-3.5 py-1 bg-white border-[0.5px] box-border border-[#BFBFBF] shadow-md text-xs";

const BUTTON_STYLE = {
  base: "px-10 py-2.5 rounded-sm text-sm font-medium transition cursor-pointer flex items-center justify-center",
  primary: "bg-primary text-white border border-primary",
  secondary: "bg-[#EAFAEA] text-secondary",
  disabled: "bg-disabled text-white disabled:cursor-not-allowed",
  // ------------------- radio input styles -------------------
  rounded: ROUNDED_BASE,
  selected:
    ROUNDED_BASE +
    " text-white bg-[#5D1A81] bg-gradient-to-l from-[#5D1A81] via-[#8225B4F2] to-[#A72FE7]",
  // ------------------- radio input styles -------------------
};

export default BUTTON_STYLE;
