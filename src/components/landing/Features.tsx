import { motion } from "framer-motion";
import { Send, Search, Clock, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Send,
    title: "Direct Requests",
    description: "Connect directly with specific talents. Send personalized requests to your preferred professionals.",
  },
  {
    icon: Search,
    title: "Open Requests",
    description: "Post opportunities and let qualified talents apply. Review applications and choose the best fit.",
  },
  {
    icon: Clock,
    title: "Time-Slot Booking",
    description: "Create events with flexible booking modes. Manage tiers, slots, and availability with ease.",
  },
  {
    icon: Shield,
    title: "Verified Talents",
    description: "All talents are verified and vetted. Work with professionals you can trust.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Reserve talent instantly or require approval. Flexible booking modes for every need.",
  },
  {
    icon: Users,
    title: "Team Events",
    description: "Hire multiple talents for large events. Manage team bookings from one dashboard.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From direct bookings to complex event management, Requestfully has 
            all the tools you need.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
