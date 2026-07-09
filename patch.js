const fs = require('fs');

function patchTransport() {
  const p = 'c:/Users/Lenovo/Desktop/ortahisar-city-guide/screens/TransportScreen.tsx';
  let code = fs.readFileSync(p, 'utf8');

  if (!code.includes('showStickyBack')) {
    code = code.replace(
      'const [expandedKart, setExpandedKart] = React.useState<',
      `const [showStickyBack, setShowStickyBack] = React.useState(false);\n  const handleScroll = (event: any) => {\n    const y = event.nativeEvent.contentOffset.y;\n    if (y > 100 && !showStickyBack) setShowStickyBack(true);\n    if (y <= 100 && showStickyBack) setShowStickyBack(false);\n  };\n  const [expandedKart, setExpandedKart] = React.useState<`
    );

    code = code.replace(
      'setExpandedKart(null);',
      'setExpandedKart(null);\n    setShowStickyBack(false);'
    );

    code = code.replace(/<ScrollView/g, '<ScrollView\n          onScroll={handleScroll}\n          scrollEventThrottle={16}');

    const buttonCode = `
      {showStickyBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri Dön"
          onPress={detailKey ? goBack : () => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
          style={({ pressed }) => [
            styles.stickyBackBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color="#991B1B" />
        </Pressable>
      )}
    </View>`;
    
    code = code.replace(/<\/ScrollView>\s*<\/View>/g, '</ScrollView>\n' + buttonCode);

    const styleCode = `
  stickyBackBtn: {
    position: 'absolute',
    left: 0,
    top: '45%',
    width: 40,
    height: 60,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 0,
    elevation: 5,
    zIndex: 999,
  },
});`;
    // Find the last });
    const lastIndex = code.lastIndexOf('});');
    if (lastIndex !== -1) {
      code = code.substring(0, lastIndex) + styleCode + code.substring(lastIndex + 3);
    }
    fs.writeFileSync(p, code);
    console.log('Patched TransportScreen');
  }
}

function patchHotels() {
  const p = 'c:/Users/Lenovo/Desktop/ortahisar-city-guide/screens/HotelsScreen.tsx';
  let code = fs.readFileSync(p, 'utf8');

  if (!code.includes('showStickyBack')) {
    code = code.replace(
      'const scrollViewRef = React.useRef<ScrollView>(null);',
      `const scrollViewRef = React.useRef<ScrollView>(null);\n  const [showStickyBack, setShowStickyBack] = React.useState(false);\n  const handleScroll = (event: any) => {\n    const y = event.nativeEvent.contentOffset.y;\n    if (y > 100 && !showStickyBack) setShowStickyBack(true);\n    if (y <= 100 && showStickyBack) setShowStickyBack(false);\n  };`
    );

    code = code.replace(
      'ref={scrollViewRef}',
      'ref={scrollViewRef}\n        onScroll={handleScroll}\n        scrollEventThrottle={16}'
    );

    const buttonCode = `
      {showStickyBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Başa Dön"
          onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
          style={({ pressed }) => [
            styles.stickyBackBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color="#991B1B" />
        </Pressable>
      )}
    </View>`;
    
    code = code.replace(/<\/ScrollView>\s*<\/View>/g, '</ScrollView>\n' + buttonCode);

    const styleCode = `
  stickyBackBtn: {
    position: 'absolute',
    left: 0,
    top: '45%',
    width: 40,
    height: 60,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 0,
    elevation: 5,
    zIndex: 999,
  },
});`;
    const lastIndex = code.lastIndexOf('});');
    if (lastIndex !== -1) {
      code = code.substring(0, lastIndex) + styleCode + code.substring(lastIndex + 3);
    }
    fs.writeFileSync(p, code);
    console.log('Patched HotelsScreen');
  }
}

function patchHotelDetail() {
  const p = 'c:/Users/Lenovo/Desktop/ortahisar-city-guide/screens/HotelDetailScreen.tsx';
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');

  if (!code.includes('showStickyBack')) {
    code = code.replace(
      'const tabBarHeight = useBottomTabBarHeight();',
      `const tabBarHeight = useBottomTabBarHeight();\n  const [showStickyBack, setShowStickyBack] = React.useState(false);\n  const handleScroll = (event: any) => {\n    const y = event.nativeEvent.contentOffset.y;\n    if (y > 100 && !showStickyBack) setShowStickyBack(true);\n    if (y <= 100 && showStickyBack) setShowStickyBack(false);\n  };`
    );

    code = code.replace(
      '<ScrollView',
      '<ScrollView\n        onScroll={handleScroll}\n        scrollEventThrottle={16}'
    );

    const buttonCode = `
      {showStickyBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri Dön"
          onPress={onBack}
          style={({ pressed }) => [
            styles.stickyBackBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color="#991B1B" />
        </Pressable>
      )}
    </View>`;
    
    // In HotelDetailScreen, there is a Floating Action Bar after ScrollView.
    // So we replace the final </View> of the component.
    // We can just find `    </View>\n  );\n}`
    code = code.replace(/<\/View>\s*\);\s*}/g, buttonCode + '\n  );\n}');

    const styleCode = `
  stickyBackBtn: {
    position: 'absolute',
    left: 0,
    top: '45%',
    width: 40,
    height: 60,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 0,
    elevation: 5,
    zIndex: 999,
  },
});`;
    const lastIndex = code.lastIndexOf('});');
    if (lastIndex !== -1) {
      code = code.substring(0, lastIndex) + styleCode + code.substring(lastIndex + 3);
    }
    fs.writeFileSync(p, code);
    console.log('Patched HotelDetailScreen');
  }
}

patchTransport();
patchHotels();
patchHotelDetail();
