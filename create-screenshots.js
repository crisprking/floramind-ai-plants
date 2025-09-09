const fs = require('fs');
const path = require('path');

// Create a simple HTML file that renders each screenshot individually
const createScreenshotHTML = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .screenshot {
            width: 375px;
            height: 812px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            position: relative;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 30px;
        }
        .premium-card {
            background: linear-gradient(135deg, #FFD700, #FFA500);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            text-align: center;
            color: white;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        }
        .price {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
        }
        .features {
            text-align: left;
            margin: 20px 0;
        }
        .feature {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .button {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            width: 100%;
            margin: 20px 0;
            cursor: pointer;
        }
        .pack-option {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 20px;
            margin: 10px 0;
            text-align: center;
        }
        .pack-price {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
        }
        .selected {
            border-color: #4CAF50;
            background: #f0f8f0;
        }
    </style>
</head>
<body>
    <div class="screenshot">
        ${content}
    </div>
</body>
</html>`;

// Monthly Subscription
const monthlyContent = `
    <div class="header">FloraMind Premium</div>
    <div class="content">
        <div class="premium-card">
            <h2>Premium Monthly</h2>
            <div class="price">$4.99/month</div>
            <p>Unlimited plant identifications</p>
        </div>
        <div class="features">
            <div class="feature">✓ Unlimited plant identifications</div>
            <div class="feature">✓ Advanced plant care tips</div>
            <div class="feature">✓ Plant health monitoring</div>
            <div class="feature">✓ Premium plant database</div>
            <div class="feature">✓ No ads</div>
        </div>
        <button class="button">Start Free Trial</button>
        <p style="text-align: center; color: #666; font-size: 12px;">
            Cancel anytime. Auto-renewable subscription.
        </p>
    </div>
`;

// Yearly Subscription
const yearlyContent = `
    <div class="header">FloraMind Premium</div>
    <div class="content">
        <div class="premium-card">
            <h2>Premium Yearly</h2>
            <div class="price">$19.99/year</div>
            <p>Save 67% with annual subscription</p>
        </div>
        <div class="features">
            <div class="feature">✓ Unlimited plant identifications</div>
            <div class="feature">✓ Advanced plant care tips</div>
            <div class="feature">✓ Plant health monitoring</div>
            <div class="feature">✓ Premium plant database</div>
            <div class="feature">✓ No ads</div>
        </div>
        <button class="button">Start Free Trial</button>
        <p style="text-align: center; color: #666; font-size: 12px;">
            Cancel anytime. Auto-renewable subscription.
        </p>
    </div>
`;

// Pack 10
const pack10Content = `
    <div class="header">Plant Identifications</div>
    <div class="content">
        <h2 style="text-align: center; color: #333;">Choose Your Pack</h2>
        
        <div class="pack-option selected">
            <h3>10 Identifications</h3>
            <div class="pack-price">$2.99</div>
            <p>Perfect for occasional plant lovers</p>
            <button class="button" style="background: #4CAF50;">Purchase</button>
        </div>
        
        <div class="pack-option">
            <h3>50 Identifications</h3>
            <div class="pack-price">$9.99</div>
            <p>Great for plant enthusiasts</p>
            <button class="button">Purchase</button>
        </div>
    </div>
`;

// Pack 50
const pack50Content = `
    <div class="header">Plant Identifications</div>
    <div class="content">
        <h2 style="text-align: center; color: #333;">Choose Your Pack</h2>
        
        <div class="pack-option">
            <h3>10 Identifications</h3>
            <div class="pack-price">$2.99</div>
            <p>Perfect for occasional plant lovers</p>
            <button class="button">Purchase</button>
        </div>
        
        <div class="pack-option selected">
            <h3>50 Identifications</h3>
            <div class="pack-price">$9.99</div>
            <p>Great for plant enthusiasts</p>
            <button class="button" style="background: #4CAF50;">Purchase</button>
        </div>
    </div>
`;

// Create individual HTML files for each screenshot
fs.writeFileSync('monthly-screenshot.html', createScreenshotHTML('Monthly Subscription', monthlyContent));
fs.writeFileSync('yearly-screenshot.html', createScreenshotHTML('Yearly Subscription', yearlyContent));
fs.writeFileSync('pack10-screenshot.html', createScreenshotHTML('Pack 10', pack10Content));
fs.writeFileSync('pack50-screenshot.html', createScreenshotHTML('Pack 50', pack50Content));

console.log('✅ Created individual screenshot HTML files:');
console.log('📱 monthly-screenshot.html');
console.log('📱 yearly-screenshot.html');
console.log('📱 pack10-screenshot.html');
console.log('📱 pack50-screenshot.html');
console.log('');
console.log('📸 Instructions:');
console.log('1. Open each HTML file in your browser');
console.log('2. Right-click on the screenshot');
console.log('3. Select "Save image as..." or "Copy image"');
console.log('4. Save as PNG files for App Store Connect');
