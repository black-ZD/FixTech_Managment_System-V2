import { useNavigate } from "react-router-dom";
import { Zap, Laptop, Tv, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();


  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white"
    >

      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap size={18} />
          </div>
          <span className="font-semibold">FixTech Electronics</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="bg-indigo-600 px-4 py-2 rounded-lg text-sm"
        >
          Staff Login
        </motion.button>
      </div>

 
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl font-bold"
        >
          Quality Electronics for Everyday Life
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="text-zinc-400 mt-4"
        >
          We sell laptops, TVs, accessories, and electrical devices at the best prices.
        </motion.p>

        <motion.button
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 bg-indigo-600 px-6 py-3 rounded-lg"
        >
          Visit Our Shop
        </motion.button>
      </section>

      {/* PRODUCTS */}
      <section className="px-6 py-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {[ 
          { icon: <Laptop />, title: "Laptops", desc: "High-performance laptops for work and gaming." },
          { icon: <Tv />, title: "Televisions", desc: "Smart TVs with modern features." },
          { icon: <Cpu />, title: "Accessories", desc: "Chargers, cables, and essentials." }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ y: -8 }}
            className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center"
          >
            <div className="mb-4 text-indigo-500 flex justify-center">
              {item.icon}
            </div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-zinc-400 text-sm">{item.desc}</p>
          </motion.div>
        ))}

      </section>

      {/* WHY US */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center py-20 px-6 max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
        <p className="text-zinc-400">
          We provide reliable products, affordable prices, and trusted service.
        </p>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center pb-20"
      >
        <h3 className="text-xl mb-4">Need help or want to buy?</h3>

        <motion.button
            whileHover={{ scale: 1.08 }}
             whileTap={{ scale: 0.95 }}
             className="bg-indigo-600 px-6 py-3 rounded-lg"
            onClick={() => navigate("/contact")}
             >
             Contact Us
        </motion.button>
      </motion.section>

      {/* FOOTER */}
      <footer className="text-center text-zinc-600 text-sm pb-6">
        FixTech Electronics © {new Date().getFullYear()}
      </footer>
    </motion.div>
  );
}