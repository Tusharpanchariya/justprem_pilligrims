export default function VideoStory() {
  return (
    <section className="relative h-[90vh] w-full bg-near-black">
      <iframe
        src="https://www.youtube.com/embed/DCnkvgjX-1A?start=2"
        title="YouTube video player"
        className="absolute inset-0 h-full w-full object-cover"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </section>
  );
}
                                         