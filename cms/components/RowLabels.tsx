'use client';

import { useRowLabel } from '@payloadcms/ui';

// Name list rows in the CMS after their content, instead of "Photo 01", "Question 02"…

export function MosaicRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string }>();
  return <span>{data?.label || `Photo ${(rowNumber ?? 0) + 1}`}</span>;
}

export function FaqRowLabel() {
  const { data, rowNumber } = useRowLabel<{ question?: string }>();
  return <span>{data?.question || `Question ${(rowNumber ?? 0) + 1}`}</span>;
}
