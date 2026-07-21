import { Flex, Button } from "@/src/components/base";

/* ─────────────────────────────────────────────
   ButtonStyles — Live showcase of all Button variants
   ───────────────────────────────────────────── */
export const BtnStyles = () => {
  return (
    <Flex direction="column" className="p-8 gap-10">

      {/* ── Section header ─────────────────────── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-1">
          Components / Button
        </p>
        <h2 className="text-2xl font-bold text-black">Button variants</h2>
        <p className="text-sm text-black/50 mt-1">
          Solid + Soft pairs · default{" "}
          <code className="bg-black/5 px-1 rounded text-black/70">rounded-lg</code>
          {" "}· soft uses{" "}
          <code className="bg-black/5 px-1 rounded text-black/70">bg-current/10</code>
          {" "}so the tint always matches the text colour automatically
        </p>
      </div>

      {/* ── Solid ───────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Solid
        </p>
        <Flex direction="row" className="flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="black">Black</Button>
          <Button variant="white">White</Button>
        </Flex>
      </section>

      {/* ── Soft ────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Soft — text coloured · bg auto-adapts via <code className="normal-case">bg-current</code>
        </p>
        <Flex direction="row" className="flex-wrap gap-3">
          <Button variant="primary-soft">Primary</Button>
          <Button variant="danger-soft">Danger</Button>
          <Button variant="success-soft">Success</Button>
          <Button variant="warning-soft">Warning</Button>
          <Button variant="black-soft">Black</Button>
          <Button variant="white-soft">White</Button>
        </Flex>
      </section>

      {/* ── Ghost (transparent → soft on hover) ─── */}
      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Ghost — transparent · reveals <code className="normal-case">bg-current/10</code> on hover
        </p>
        <Flex direction="row" className="flex-wrap gap-3">
          <Button variant="primary-ghost">Primary</Button>
          <Button variant="danger-ghost">Danger</Button>
          <Button variant="success-ghost">Success</Button>
          <Button variant="warning-ghost">Warning</Button>
          <Button variant="black-ghost">Black</Button>
          <Button variant="white-ghost">White</Button>
        </Flex>
      </section>

      {/* ── Roundedness options ────────────────── */}
      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Roundedness
        </p>
        <Flex direction="row" className="flex-wrap gap-3 items-center">
          <Button variant="primary" rounded="none">None</Button>
          <Button variant="primary" rounded="sm">Small</Button>
          <Button variant="primary" rounded="md">Medium</Button>
          <Button variant="primary" rounded="lg">Large (default)</Button>
          <Button variant="primary" rounded="full">Full</Button>
        </Flex>
      </section>

      {/* ── Disabled state ─────────────────────── */}
      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Disabled
        </p>
        <Flex direction="row" className="flex-wrap gap-3">
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="danger"  disabled>Danger</Button>
          <Button variant="success" disabled>Success</Button>
          <Button variant="warning" disabled>Warning</Button>
          <Button variant="primary-soft" disabled>Primary soft</Button>
          <Button variant="danger-soft"  disabled>Danger soft</Button>
        </Flex>
      </section>

      {/* ── Hover None ─────────────────────────── */}
      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Hover None — no hover/active effects
        </p>
        <Flex direction="row" className="flex-wrap gap-3">
          <Button variant="primary" disableHoverEffect>Solid Primary</Button>
          <Button variant="danger-soft" disableHoverEffect>Soft Danger</Button>
          <Button variant="success-ghost" disableHoverEffect>Ghost Success</Button>
        </Flex>
      </section>

      {/* ── Loading / Loader ───────────────────── */}
      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Loading States
        </p>
        <Flex direction="row" className="flex-wrap gap-3 items-center">
          <Button variant="primary" isLoading>
            Default Loading
          </Button>
          <Button
            variant="success-soft"
            isLoading
            loader={
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            }
          >
            Custom Spinner
          </Button>
        </Flex>
      </section>

      {/* ── Full Width ─────────────────────────── */}
      <section className="flex flex-col gap-3 w-full max-w-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Full Width
        </p>
        <Flex direction="column" className="gap-2">
          <Button variant="primary" fullWidth>
            Full Width Primary Button
          </Button>
          <Button variant="black-soft" fullWidth>
            Full Width Soft Black Button
          </Button>
        </Flex>
      </section>

      {/* ── Tooltips ───────────────────────────── */}
      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Buttons with Tooltips
        </p>
        <Flex direction="row" className="flex-wrap gap-3">
          <Button variant="primary" tooltipContent="Save all changes to the database">
            Hover Me
          </Button>
          <Button variant="danger-soft" tooltipContent="This action is permanent and cannot be undone">
            Hover for Warning
          </Button>
          <Button variant="success-ghost" tooltipContent="No tooltip content should show if none is passed">
            Button without Tooltip
          </Button>
        </Flex>
      </section>

    </Flex>
  );
};
