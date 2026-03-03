export type EllipsizeTextOptions = {
  text: string;
  truncRatio?: number;
  postEllipsisCount?: number;
};

export const ellipsizeText = ({
  text,
  truncRatio = 3,
  postEllipsisCount,
}: EllipsizeTextOptions) => {
  const len = String(text).length;
  const truncateLen = Math.floor(len / truncRatio);
  const preEllipsis = String(text).slice(0, truncateLen);
  let postEllipsis = String(text).slice(truncateLen * (truncRatio - 1), len);
  if (postEllipsisCount) {
    postEllipsis = String(text).slice(-postEllipsisCount);
  }
  return `${preEllipsis}...${postEllipsis}`;
};
