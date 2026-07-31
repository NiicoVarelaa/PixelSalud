import { useAuthStore } from "@store/useAuthStore";
import { useCallback } from "react";
import {
  FooterBottomBar,
  FooterBrand,
  FooterLinkSection,
  FooterNewsletterForm,
} from "./components";
import {
  FOOTER_INFO_LINKS,
  FOOTER_LOGOS,
  FOOTER_SUPPORT_LINKS,
} from "./constants";
import { useFooterNewsletter } from "./hooks";

const Footer = () => {
  const { user } = useAuthStore();
  const {
    email,
    isSubscribed,
    isSubmitting,
    aceptaMarketing,
    inputDisabled,
    buttonDisabled,
    currentYear,
    setEmail,
    setAceptaMarketing,
    handleSubscribe,
  } = useFooterNewsletter({ user });

  const handleEmailChange = useCallback(
    (event) => {
      setEmail(event.target.value);
    },
    [setEmail],
  );

  const handleAceptaMarketingChange = useCallback(
    (event) => {
      setAceptaMarketing(event.target.checked);
    },
    [setAceptaMarketing],
  );

  return (
    <footer>
      <section className="w-full max-w-7xl py-10 mx-auto sm:pt-16 lg:pt-24 lg:px-8">
        <div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-16 md:col-span-3 lg:grid-cols-6">
            <FooterBrand />

            <FooterLinkSection title="Información" links={FOOTER_INFO_LINKS} />

            <FooterLinkSection
              title="Atención al Cliente"
              links={FOOTER_SUPPORT_LINKS}
            />

            <FooterNewsletterForm
              email={email}
              isSubscribed={isSubscribed}
              isSubmitting={isSubmitting}
              aceptaMarketing={aceptaMarketing}
              inputDisabled={inputDisabled}
              buttonDisabled={buttonDisabled}
              onEmailChange={handleEmailChange}
              onAceptaMarketingChange={handleAceptaMarketingChange}
              onSubmit={handleSubscribe}
            />
          </div>

          <hr className="mt-16 mb-10 border-gray-200" />

          <FooterBottomBar currentYear={currentYear} logos={FOOTER_LOGOS} />
        </div>
      </section>
    </footer>
  );
};

export default Footer;
