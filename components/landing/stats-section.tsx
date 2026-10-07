import React from "react"

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "500K+", label: "Assessments Completed" },
  { value: "95%", label: "Customer Satisfaction" },
  { value: "40+", label: "Languages Supported" },
]

export function StatsSection() {
  return (
    <section className="border-y border-border bg-primary py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-primary-foreground md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-primary-foreground/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
