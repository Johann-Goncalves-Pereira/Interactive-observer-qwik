import type { OnRenderFn } from "@builder.io/qwik";
import { component$, useClientEffect$, useStore } from "@builder.io/qwik";

type Props = {
  threshold?: number;
  root?: OnRenderFn<Element> | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
};

export default component$(
  (
    elementRef: OnRenderFn<Element>,
    {
      threshold = 0,
      root = null,
      rootMargin = "0%",
      freezeOnceVisible = false,
    }: Props
  ) => {
    const store = useStore({
      entry: null as unknown as IntersectionObserverEntry,
    });

    const frozen = store.entry?.isIntersecting && freezeOnceVisible;

    const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
      store.entry = entry;
    };

    useClientEffect$(({ track }) => {
      track(store);

      const node = elementRef?.current; // DOM Ref
      const hasIOSupport = !!window.IntersectionObserver;

      if (!hasIOSupport || frozen || !node) return;

      const observerParams = { threshold, root, rootMargin };
      const observer = new IntersectionObserver(updateEntry, observerParams);

      observer.observe(node);

      return () => observer.disconnect();
    });
  }
);
