import React from "react";
import { useTimeSync } from "@/util/hooks";

function TimeSyncComponent() {
  const { timeOffset, loading, error } = useTimeSync();

  return (
    <div>
      <h2>時刻同期チェック</h2>
      {loading ? (
        <p>同期中...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>クライアントとNTPサーバーの時刻差: {Math.abs(timeOffset)} ミリ秒</p>
      )}
    </div>
  );
}

export default TimeSyncComponent;
