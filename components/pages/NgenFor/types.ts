export interface IHowItWorksCardProps {
  classNames?: string;
  bgColor: string;
  title: string;
  desc: string;
  imgSrc: string;
  altText: string;
}

export interface IHowItWorksData {
  data: IHowItWorksCardProps[];
}

export interface IFeaturedProps {
  features: string[];
  imgSrc: string;
}

export interface ITracksOverviewCardProps {
  text: string;
  imgSrc: string;
}

export interface ITracksOverviewSectionProps {
  data: ITracksOverviewCardProps[];
}