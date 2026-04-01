const fontMap = {
  Inter: "Inter, sans-serif",
  Poppins: "Poppins, sans-serif",
  "DM Sans": '"DM Sans", sans-serif',
  Manrope: "Manrope, sans-serif",
};

const WidgetPreview = ({ form }) => {
  const themeColor = form.appearance.themeColor || "#8b5cf6";
  const fontFamily = fontMap[form.appearance.font] || "Inter, sans-serif";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-5 shadow-xl">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-textDim">Live Preview</p>
      <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-2xl" style={{ fontFamily }}>
        <h3 className="text-2xl font-bold">{form.title || "Untitled Form"}</h3>
        <p className="mt-2 text-sm text-slate-500">
          {form.description || "Add a short description to guide your visitors."}
        </p>

        <div className="mt-6 space-y-4">
          {form.fields.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
              Add fields from the left panel to preview your widget.
            </div>
          ) : (
            form.fields.map((field) => (
              <div key={field.id} className="rounded-xl border border-slate-200 p-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {field.label}
                  {field.required ? " *" : ""}
                </label>
                {field.type === "text" && (
                  <input
                    disabled
                    placeholder={field.placeholder || "Text input"}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3"
                  />
                )}
                {field.type === "feedback" && (
                  <textarea
                    disabled
                    placeholder={field.placeholder || "Write feedback"}
                    className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3"
                  />
                )}
                {field.type === "dropdown" && (
                  <select disabled className="w-full rounded-xl border border-slate-200 px-4 py-3">
                    <option>Select an option</option>
                    {field.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                )}
                {field.type === "checkbox" && (
                  <div className="space-y-2">
                    {field.options.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-600">
                        <input type="checkbox" disabled />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === "rating" && (
                  <div className="flex gap-2 text-2xl" style={{ color: themeColor }}>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                )}
                {field.type === "nps" && (
                  <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
                    {Array.from({ length: 11 }, (_, index) => (
                      <button
                        key={index}
                        type="button"
                        className="rounded-lg px-2 py-2 text-xs text-white"
                        style={{ backgroundColor: themeColor }}
                      >
                        {index}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          className="mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: themeColor }}
        >
          {form.appearance.submitButtonLabel || "Submit"}
        </button>
      </div>
    </div>
  );
};

export default WidgetPreview;
