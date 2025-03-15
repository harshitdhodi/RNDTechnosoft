import React, { useRef, Suspense } from 'react';

// Lazy load all components
const HeroSection = React.lazy(() => import('../components/HeroSection'));
const Marquee = React.lazy(() => import('../components/Marquee'));
const OurWorkComponent = React.lazy(() => import('../components/OurWork'));
const TrustedSection = React.lazy(() => import('../components/BigCards'));
const WeAreExpert = React.lazy(() => import('../components/WeAreExpert'));
const WhatYouGet = React.lazy(() => import('../components/WhatYouGet'));
const BookAcall = React.lazy(() => import('../components/BookAcall'));
const ServiceGrid = React.lazy(() => import('../components/OurServices'));
const GlobalSolution = React.lazy(() => import('../components/GlobalSolution'));
const Faq = React.lazy(() => import('../components/Faq'));
const StandardPackage = React.lazy(() => import('../components/StandardPackage'));
const PremiumTemplatesSection = React.lazy(() => import('../components/PrimiumTemplateSection'));

export default function Homepage() {
  const serviceGridRef = useRef(null);

  // Fallback component while loading
  const LoadingFallback = () => <div>Loading...</div>;

  return (
    <div>
      <Suspense fallback={<LoadingFallback />}>
        <HeroSection serviceGridRef={serviceGridRef} />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Marquee />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <OurWorkComponent />
      </Suspense>
      
      <div ref={serviceGridRef}>
        <Suspense fallback={<LoadingFallback />}>
          <ServiceGrid />
        </Suspense>
      </div>
      
      <Suspense fallback={<LoadingFallback />}>
        <WeAreExpert />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <TrustedSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <WhatYouGet />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <StandardPackage />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Faq />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <BookAcall />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <PremiumTemplatesSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <GlobalSolution />
      </Suspense>
    </div>
  );
}