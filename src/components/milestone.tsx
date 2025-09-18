"use client";

import { useState, useMemo, useCallback } from "react";
import { IconDelivery } from "./icon-delivery";
import { IconGift } from "./icon-gift";
import { IconTag } from "./icon-tag";
import { Countdown } from "./countdown";
import { filter, includes, map } from "es-toolkit/compat";
import { RainbowButton } from "./ui/rainbow-button";

type Props = {
  currency?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  countdownFormat?: string;
  isShowCountdown?: boolean;
};

const mockMilestone = [
  {
    id: "1",
    spendGoal: 6,
    type: "gift",
  },
  {
    id: "2",
    spendGoal: 180,
    type: "tag",
  },
  {
    id: "3",
    spendGoal: 360,
    type: "delivery",
  },
  {
    id: "4",
    spendGoal: 3600,
    type: "delivery",
  },
];
export const Milestone: React.FC<Props> = ({
  currency = "EUR",
  startDate = "2025-09-13",
  endDate = "2025-09-20",
  startTime = "15:00",
  endTime = "18:00",
  countdownFormat = "dd:hh:mm:ss",
  isShowCountdown = true,
}) => {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [selectedMilestone, setSelectedMilestone] = useState<String[]>([]);
  const [isTestingMode, setIsTestingMode] = useState(false);
  const [testStartDate, setTestStartDate] = useState(startDate);
  const [testEndDate, setTestEndDate] = useState(endDate);
  const [testStartTime, setTestStartTime] = useState(startTime);
  const [testEndTime, setTestEndTime] = useState(endTime);

  const isNextMilestone = useMemo(() => {
    return filter(mockMilestone, (m) => currentAmount < m.spendGoal)[0];
  }, [currentAmount]);

  const isMilestoneReached = useMemo(() => {
    return filter(mockMilestone, (m) => currentAmount >= m.spendGoal);
  }, [currentAmount]);

  const maxSpendGoal = useMemo(() => {
    return Math.max(...map(mockMilestone, (i) => i.spendGoal));
  }, []);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAmount(Number(e.target.value));
  };

  return (
    <div className="flex flex-col p-16 items-center w-full ">
      <div className="flex flex-col p-16 items-center w-full gap-4">
        <Countdown
          startDate={isTestingMode ? testStartDate : startDate}
          endDate={isTestingMode ? testEndDate : endDate}
          startTime={isTestingMode ? testStartTime : startTime}
          endTime={isTestingMode ? testEndTime : endTime}
          countdownFormat={
            countdownFormat as "dd:hh:mm:ss" | "hh:mm:ss" | "hh:mm" | "mm:ss"
          }
          isShowCountdown={isShowCountdown}
        />
        <div className="text-base font-bold">
          {isNextMilestone
            ? `You are ${(isNextMilestone?.spendGoal - currentAmount).toFixed(
                2
              )} ${currency} away from getting ${
                isNextMilestone?.type === "gift"
                  ? "free gift"
                  : isNextMilestone?.type === "tag"
                  ? "cart discount"
                  : "shipping discount"
              }`
            : "Congratulations! You've achieved all milestones"}
        </div>

        <div className="w-full h-3 rounded-full relative bg-[#ECECEC]">
          <div
            className="h-full bg-[#1e40af] rounded-full transition-all duration-300"
            style={{
              width: `${(currentAmount / maxSpendGoal) * 100}%`,
              transition: "width 0.3s ease-in-out",
            }}
          />
          {map(mockMilestone, (milestone) => {
            const leftPercentage = (milestone?.spendGoal / maxSpendGoal) * 100;
            const isReached = currentAmount >= milestone?.spendGoal;

            return (
              <div className="group" key={milestone?.id}>
                <div
                  className={`absolute -top-8 left-0 -translate-x-1/2 text-sm group-hover:block ${
                    milestone?.id === isNextMilestone?.id ? "block" : "hidden"
                  }`}
                  style={{
                    left: `${leftPercentage}%`,
                  }}
                >
                  <div className="flex items-center text-sm">
                    <span>{milestone?.spendGoal.toFixed(2)}</span>
                    <span>{currency}</span>
                  </div>
                </div>
                <div
                  className="rounded-full h-10 w-10 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex items-center justify-center"
                  style={{
                    left: `${leftPercentage}%`,
                    backgroundColor: isReached ? "#1e40af" : "#FFFFFF",
                    border: isReached ? "none" : "1px solid #C6C6C6",
                    animation: isReached
                      ? "scaleAnimation .3s ease-in-out"
                      : "",
                  }}
                >
                  {milestone?.type === "gift" ? (
                    <IconGift color={isReached ? "#FFFFFF" : "#9F9F9F"} />
                  ) : milestone?.type === "tag" ? (
                    <IconTag
                      className="rotate-90"
                      color={isReached ? "#FFFFFF" : "#9F9F9F"}
                    />
                  ) : (
                    <IconDelivery color={isReached ? "#FFFFFF" : "#9F9F9F"} />
                  )}
                </div>
                <div
                  className={`absolute top-8 left-0 -translate-x-1/2 text-sm group-hover:block ${
                    milestone?.id === isNextMilestone?.id ? "block" : "hidden"
                  }`}
                  style={{
                    left: `${leftPercentage}%`,
                  }}
                >
                  {milestone?.type === "gift"
                    ? "Free gift"
                    : milestone?.type === "tag"
                    ? "Cart discount"
                    : "Shipping discount"}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 mt-16">
          {map(isMilestoneReached, (milestone) => {
            return (
              <div
                key={milestone?.id}
                style={{
                  borderTop: "1px solid #EBEBEB",
                  paddingTop: "8px",
                }}
              >
                <div className="flex justify-between gap-16 items-center">
                  <div className="flex flex-col gap-1">
                    <div className="font-bold">
                      {milestone?.type === "gift"
                        ? "Free gift"
                        : milestone?.type === "tag"
                        ? "Cart discount"
                        : "Shipping discount"}
                    </div>
                    <div>Congratulations! You have unlocked a reward!</div>
                  </div>
                  <RainbowButton
                    className="cursor-pointer text-white rounded-sm p-[7px] w-[40%] text-sm"
                    onClick={() => {
                      setSelectedMilestone([
                        ...selectedMilestone,
                        milestone?.id,
                      ]);
                    }}
                    style={{
                      backgroundColor: !includes(
                        selectedMilestone,
                        milestone?.id
                      )
                        ? "#1e40af"
                        : "#d9cdcd",
                    }}
                  >
                    {!includes(selectedMilestone, milestone?.id)
                      ? milestone?.type === "gift"
                        ? "Select gifts"
                        : "Apply code"
                      : milestone?.type === "gift"
                      ? "Selected gifts"
                      : "Applied code"}
                  </RainbowButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full relative">
        <div>Cart total</div>
        <div className="w-full flex gap-1 items-center">
          <input
            type="range"
            className="w-full"
            min="0"
            max={maxSpendGoal}
            step="0.01"
            value={currentAmount}
            onChange={handleRangeChange}
          />
          <div className="flex items-center gap-1 text-sm">
            <span>{currentAmount.toFixed(2)}</span>
            <span>{currency}</span>
          </div>
        </div>
        <div>Slide this to see changes in preview</div>
      </div>

      {/* Testing Controls */}
      <div className="flex flex-col gap-4 w-full mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="testing-mode"
            checked={isTestingMode}
            onChange={(e) => setIsTestingMode(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="testing-mode" className="font-bold text-gray-700">
            Testing Mode - Override Dates
          </label>
        </div>

        {isTestingMode && (
          <div className="flex flex-col gap-4">
            {/* Manual Date/Time Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={testStartDate}
                  onChange={(e) => setTestStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  value={testStartTime}
                  onChange={(e) => setTestStartTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={testEndDate}
                  onChange={(e) => setTestEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  value={testEndTime}
                  onChange={(e) => setTestEndTime(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Use testing mode to override the default start/end dates and times for
          testing the countdown functionality.
        </div>
      </div>
    </div>
  );
};
