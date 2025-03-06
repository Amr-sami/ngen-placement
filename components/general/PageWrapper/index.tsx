import React, { ReactNode } from 'react';

interface PageWrapperProps {
  classNames?: string;
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ classNames, children }) => {
  return <main className={classNames} >{children}</main>;
};

export default PageWrapper;