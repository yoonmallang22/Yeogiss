import { useState } from "react";
import normalBinIcon from "@/assets/normal_bin.svg";
import whiteNormalBinIcon from "@/assets/normal_bin_white.svg";
import recycleBinIcon from "@/assets/cycle_bin.svg";
import whiteRecycleBinIcon from "@/assets/cycle_bin_white.svg";
import RadioButton from "@/components/common/Button/RadioButton";

export type BinType = "all" | "normal" | "recycle";

/**
 * 홈 화면 상단 전체/일반/재활용 쓰레기통 필터링 라디오 인풋 컴포넌트
 */
const FilteringButton = ({
  onChange,
}: {
  onChange?: (binType: BinType) => void;
}) => {
  const [selected, setSelected] = useState<BinType>("all"); // default 전체

  return (
    <div className="absolute top-4 left-3 z-10 flex gap-2">
      <RadioButton
        variant={selected === "all" ? "selected" : "rounded"}
        name="bins-filtering"
        value="all"
        onChange={() => {
          setSelected("all");
          if (onChange) {
            onChange("all");
          }
        }}
      >
        전체
      </RadioButton>
      <RadioButton
        variant={selected === "normal" ? "selected" : "rounded"}
        name="bins-filtering"
        value="normal"
        onChange={() => {
          setSelected("normal");
          if (onChange) {
            onChange("normal");
          }
        }}
      >
        <img
          src={selected === "normal" ? whiteNormalBinIcon : normalBinIcon}
          alt="일반 쓰레기통"
          className="mr-1"
        />
        일반
      </RadioButton>
      <RadioButton
        variant={selected === "recycle" ? "selected" : "rounded"}
        name="bins-filtering"
        value="recycle"
        onChange={() => {
          setSelected("recycle");
          if (onChange) {
            onChange("recycle");
          }
        }}
      >
        <img
          src={selected === "recycle" ? whiteRecycleBinIcon : recycleBinIcon}
          alt="재활용 쓰레기통"
          className="mr-1"
        />
        재활용
      </RadioButton>
    </div>
  );
};

export default FilteringButton;
