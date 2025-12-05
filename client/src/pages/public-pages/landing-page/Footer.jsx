export default function Footer() {
  return (
    <footer className="px-4 py-16 sm:px-6 lg:px-8 bg-[#F7F4ED] border-t border-[#e6e0d6]">
      <div className="max-w-7xl mx-auto">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <h3 className="font-semibold text-[#0B234A] text-lg mb-3">
              Smart Student Hub
            </h3>
            <p className="text-sm text-[#4b5563] leading-relaxed">
              Centralized digital platform for managing and validating
              institution-wide student activity records.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-[#0B234A] mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li><a href="#" className="hover:text-[#0B234A] transition">Features</a></li>
              <li><a href="#" className="hover:text-[#0B234A] transition">Pricing</a></li>
              <li><a href="#" className="hover:text-[#0B234A] transition">Security</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-[#0B234A] mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li><a href="#" className="hover:text-[#0B234A] transition">About</a></li>
              <li><a href="#" className="hover:text-[#0B234A] transition">Contact</a></li>
              <li><a href="#" className="hover:text-[#0B234A] transition">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-[#0B234A] mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li><a href="#" className="hover:text-[#0B234A] transition">Privacy</a></li>
              <li><a href="#" className="hover:text-[#0B234A] transition">Terms</a></li>
              <li><a href="#" className="hover:text-[#0B234A] transition">Support</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#e6e0d6] pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-[#6b7280] gap-2">
          <p>&copy; 2025 Smart Student Hub. All rights reserved.</p>
          <p>Government of Jammu & Kashmir — Higher Education Department</p>
        </div>

      </div>
    </footer>
  );
}
