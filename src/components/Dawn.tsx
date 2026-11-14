/* Night into day. The two halves tell the nav which colours to wear. */
export function Dawn() {
  return (
    <div className="sky-dawn">
      <section data-sky="night" className="mx-auto max-w-[1240px] px-5 pt-20 pb-16 sm:px-8 sm:pt-28">
        <p className="voice max-w-[21ch] text-[clamp(1.9rem,4.3vw,3.5rem)] text-ice-50">
          Every week, companies hire, raise money, open offices and switch
          software. GtmComet searches the public web for the ones that match
          your ideal customer, and brings back twenty-five.
        </p>
      </section>
      <div data-sky="day" aria-hidden className="h-[40vh] min-h-[280px] sm:h-[34vh] sm:min-h-[240px]" />
    </div>
  );
}
