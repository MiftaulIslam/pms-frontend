import CardSpotlight from "@/components/common/card-spotlight";
import {  CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Kanban,
  Users,
  BarChart3,
  Zap,
  Shield,
  Clock,
  MessageSquare,
  Calendar,
  Target
} from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Kanban Boards",
    description: "Visualize your workflow with intuitive drag-and-drop boards that keep your team organized."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates, comments, and file sharing."
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Get insights into your team's performance with detailed analytics and custom reports."
  },
  {
    icon: Zap,
    title: "Automation",
    description: "Automate repetitive tasks and workflows to save time and reduce manual work."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Keep your data safe with enterprise-grade security and compliance standards."
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track time spent on tasks and projects to improve productivity and billing accuracy."
  },
  {
    icon: MessageSquare,
    title: "Team Chat",
    description: "Communicate instantly with built-in messaging and video calls for remote teams."
  },
  {
    icon: Calendar,
    title: "Timeline View",
    description: "Plan and track project milestones with beautiful timeline and Gantt chart views."
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set and monitor team goals with OKRs and key performance indicators."
  }
];

const Features = () => {
  return (
    <section id="features" className="bg-muted/30 py-20">
      <div className="mx-auto px-6 container">
        {/* Header */}
        <div className="space-y-4 mb-16 text-center">
          <div className="inline-flex items-center bg-primary/10 px-4 py-2 border border-primary/20 rounded-full font-medium text-primary text-sm">
            Features
          </div>

          <h2 className="font-bold text-foreground text-4xl lg:text-5xl">
            Everything you need to
            <span className="block bg-clip-text bg-gradient-primary text-transparent">
              manage projects
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
            Powerful features that help teams stay organized, collaborate effectively, and deliver results faster.
          </p>
        </div>

        {/* Features Grid */}
        <div className="gap-8 grid md:grid-cols-2 lg:grid-cols-3" role="list">
          {features.map((feature, index) => (
            <CardSpotlight key={index}>
              <CardHeader>
                <CardTitle>
                  <feature.icon className="w-6 h-6 text-primary" /></CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">

                <h3 className="font-semibold text-foreground text-xl">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p></CardContent>
            </CardSpotlight>
          ))}
          {/* <input key={index} id={index.toString()} type="radio" className="hidden"></input>
              <label htmlFor={index.toString()}>
                <Card
                  key={index}
                  tabIndex={0}
                  aria-label={`${feature.title}: ${feature.description}`}
                  className="group bg-gradient-card hover:shadow-elegant p-6 border-border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:scale-105 transition-smooth cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex justify-center items-center bg-gradient-primary group-hover:shadow-glow rounded-xl w-12 h-12 transition-smooth">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground text-xl">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </label> */}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex sm:flex-row flex-col items-center gap-4">
            <span className="text-muted-foreground">Ready to get started?</span>
            <div className="flex gap-4">
              <button className="font-semibold text-primary hover:text-primary/80 transition-smooth">
                View all features →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;