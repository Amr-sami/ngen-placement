export type SurveyFormData = {
  name: string
  age: string
  country: string
  city: string
  schoolName: string
  preferredHouse: string
  techExperience: 'Yes' | 'No' | ''
  techDetails: string
  heardAboutUs: string
  phone: string
  email: string
  selectedTrack: string
}

export type StudentInfo = {
  name: string
  age: string
  phone: string
  email: string
}

export type SurveyData = {
  country: string
  city: string
  schoolName: string
  preferredHouse: string
  techExperience: string
  techDetails: string
  heardAboutUs: string
}