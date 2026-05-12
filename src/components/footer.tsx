      import React from 'react'
      
      const Footer = () => {
        return (
          <div className="bg-black py-10">
            {/* Divider + Footer */}
      <div className="mt-10 mx-6 md:mx-14 border-t border-white/9 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-inter text-xs text-white/25">
          Copyright {new Date().getFullYear()} © ZipDrift
        </p>
        <p className="font-inter text-xs text-white/25">
          Built by Tagelabs
        </p>
      </div>
          </div>
        )
      }
      
      export default Footer
      

