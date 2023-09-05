import React from 'react'
import { DarwinSectionTitleProps } from './types'

export const DarwinSectionTitle = ({ title, subtitle }: DarwinSectionTitleProps) => {
  return (
        <div className="page-title-box">
            <div className="text-center">
              <h3>
              {title}
              </h3>
            </div>
            { subtitle &&
              (<div className="text-center">
                <p>
                {subtitle}
                </p>                   
              </div>)
            }
        </div>
  )
}
