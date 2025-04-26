
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { reviews } from "./Constants/testemonialData";



const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] shadow-md shadow-black transition-all duration-700 ease-in-out hover:border-gray-950/[.2] hover:shadow-lg hover:shadow-black/10 bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full px-8 mb-20 pt-5 sm:px-0 sm:pt-0 md:px-0 md:pt-0 xl:px-0 xl:pt-0">
    <div className="flex h-full w-full flex-col items-center  pt-10">
      <div>
        <h1 className="mb-6 text-center text-3xl font-bold dark:text-zinc-100 md:text-5xl">
          What <span className="text-primary">People</span> Are Saying
        </h1>
      </div>
      <div className="mb-6 text-xl dark:text-zinc-100 md:text-xl">
        Don’t just take our word for it. Here’s what{" "}
        <span className="font-bold">real people</span> are saying about
        Fashion Fuel.
      </div>

      <div className="w-full overflow-x-hidden">
        
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
      </div>
    </div>
  </section>
  );
}
