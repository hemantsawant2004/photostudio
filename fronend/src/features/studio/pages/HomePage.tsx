import { BookingSection } from "../components/BookingSection";
import { GallerySection } from "../components/GallerySection";
import { HeroSection } from "../components/HeroSection";
import { IntroSection } from "../components/IntroSection";
import { PackagesSection } from "../components/PackagesSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { useBookingForm } from "../hooks/useBookingForm";
import { useGallery } from "../hooks/useGallery";
import type { AuthFormState, AuthMode, AuthSubmitResult } from "../../auth/types";
import type { AuthUser } from "../../../types/auth";

type HomePageProps = {
  mode: AuthMode;
  form: AuthFormState;
  user: AuthUser | null;
  error: string | null;
  status: string | null;
  isSubmitting: boolean;
  isCheckingSession: boolean;
  token: string | null;
  unreadCount?: number;
  onModeChange: (mode: AuthMode) => void;
  onFieldChange: (field: keyof AuthFormState, value: string) => void;
  onSubmit: () => Promise<AuthSubmitResult>;
  onLogout: () => void;
};

export function HomePage(props: HomePageProps) {
  const { photos, galleryLoading, galleryError } = useGallery();
  const {
    bookingForm,
    setBookingForm,
    bookingStatus,
    bookingError,
    isSubmitting,
    today,
    syncAvailableSelection,
    handleSubmit,
  } = useBookingForm(props.user, props.token);

  return (
    <div className="min-h-screen bg-[#f7efe6] text-[#241811]">
      <HeroSection {...props} />

      <main>
        <IntroSection />
        <GallerySection
          photos={photos}
          galleryLoading={galleryLoading}
          galleryError={galleryError}
        />
        <PackagesSection />
        <TestimonialsSection />
        <BookingSection
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          bookingStatus={bookingStatus}
          bookingError={bookingError}
          isSubmitting={isSubmitting}
          syncAvailableSelection={syncAvailableSelection}
          today={today}
          handleSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
