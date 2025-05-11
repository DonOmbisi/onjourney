export interface Industry {
  value: string;
  label: string;
}

export interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  profileImage: File | null;
  profileImagePreview: string | null;
}

export interface BusinessDetails {
  businessName: string;
  businessLogo: File | null;
  businessLogoPreview: string | null;
  industry: string;
  companySize: string;
  businessDocument: File | null;
}

export interface FormData {
  personalDetails: PersonalDetails;
  businessDetails: BusinessDetails;
}
